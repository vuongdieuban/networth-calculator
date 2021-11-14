import { Certificate } from "@aws-cdk/aws-certificatemanager";
import { SubnetType, Vpc } from "@aws-cdk/aws-ec2";
import {
  ContainerImage,
  EnvironmentFile,
  FargateTaskDefinition,
  LogDrivers,
} from "@aws-cdk/aws-ecs";
import { ApplicationLoadBalancedFargateService } from "@aws-cdk/aws-ecs-patterns";
import { ApplicationProtocol } from "@aws-cdk/aws-elasticloadbalancingv2";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import * as cdk from "@aws-cdk/core";

export class BackendStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = this.createVpc();
    const ecsService = this.createEcsService(vpc);
  }

  private createVpc() {
    return new Vpc(this, "AppVpc", {
      cidr: "10.0.0.0/16",
      maxAzs: 2,
      subnetConfiguration: [
        {
          cidrMask: 24,
          name: "public",
          subnetType: SubnetType.PUBLIC,
        },
      ],
    });
  }

  private createEcsService(vpc: Vpc) {
    const certificate = Certificate.fromCertificateArn(
      this,
      "Cert",
      "arn:aws:acm:ca-central-1:355037942502:certificate/ddeb1713-eb0e-491e-8f4a-dc4bda122240"
    );

    const taskDefinition = this.createTaskDefinition();
    const service = new ApplicationLoadBalancedFargateService(this, "DemoAppService", {
      vpc,
      assignPublicIp: true,
      publicLoadBalancer: true,
      cpu: 256,
      memoryLimitMiB: 512,
      taskDefinition,
      protocol: ApplicationProtocol.HTTPS,
      certificate,
    });

    service.targetGroup.configureHealthCheck({
      path: "/health",
    });

    return service;
  }

  private createTaskDefinition() {
    const taskDef = new FargateTaskDefinition(this, "DemoTaskDef");

    taskDef.addContainer("app", {
      image: ContainerImage.fromRegistry("banvuong/networth-calculator:demo"),
      portMappings: [
        {
          containerPort: 3000,
          hostPort: 3000,
        },
      ],
      // basepath is at the root of the  infrastructure project
      environmentFiles: [EnvironmentFile.fromAsset("../dev.env")],
      logging: LogDrivers.awsLogs({
        streamPrefix: "demo",
      }),
    });

    taskDef.addContainer("db", {
      image: ContainerImage.fromRegistry("postgres:14"),
      environment: {
        POSTGRES_DB: "demo",
        POSTGRES_USER: "postgres",
        POSTGRES_PASSWORD: "postgres", // hardcode password for demo purpose
      },
    });

    taskDef.addToExecutionRolePolicy(
      new PolicyStatement({
        resources: ["*"],
        actions: [
          "logs:*", // full access to cloudwatch logs
          "s3:*",
        ],
      })
    );

    return taskDef;
  }
}
