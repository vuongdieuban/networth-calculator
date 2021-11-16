import { Stack, App, StackProps, RemovalPolicy, Duration } from "@aws-cdk/core";
import { Distribution } from "@aws-cdk/aws-cloudfront";
import { ARecord, HostedZone, RecordTarget } from "@aws-cdk/aws-route53";
import { Bucket } from "@aws-cdk/aws-s3";
import { DnsValidatedCertificate } from "@aws-cdk/aws-certificatemanager";
import * as origins from "@aws-cdk/aws-cloudfront-origins";
import { BucketDeployment, Source } from "@aws-cdk/aws-s3-deployment";
import { CloudFrontTarget } from "@aws-cdk/aws-route53-targets";

export class FrontendStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props);
    const domainName = "banvuong.ca";
    const siteDomain = "demo.banvuong.ca";

    const hostedZone = HostedZone.fromLookup(this, "Zone", { domainName });

    // Content bucket
    const siteBucket = new Bucket(this, "SiteBucket", {
      bucketName: "networth-frontend",
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      // DestroyPolicy for convience of demo purpose to cleaning up s3 with cdk destroy
      // not suitable for prod use.
      removalPolicy: RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    // create and validate certificate for cloudfront to use
    // us-east-1 is required because clouldfront only look for certificate on that region
    const certificate = new DnsValidatedCertificate(this, "SiteCert", {
      domainName: siteDomain,
      hostedZone,
      region: "us-east-1",
    });

    const distribution = new Distribution(this, "CloudfrontDistDemo", {
      defaultBehavior: { origin: new origins.S3Origin(siteBucket) },
      domainNames: [siteDomain],
      certificate,
      errorResponses: [
        {
          httpStatus: 404,
          ttl: Duration.seconds(0),
          responseHttpStatus: 200,
          responsePagePath: "/index.html",
        },
      ],
    });

    // Deploy site contents to S3 bucket
    new BucketDeployment(this, "DeployStaticContent", {
      sources: [Source.asset("../frontend/dist/frontend")],
      destinationBucket: siteBucket,
      distribution,
      distributionPaths: ["/*"],
    });

    // create a record to alias clouldfront domain name
    new ARecord(this, "SiteAliasRecord", {
      recordName: siteDomain,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
      zone: hostedZone,
    });
  }
}
