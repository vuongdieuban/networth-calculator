#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "@aws-cdk/core";
import { BackendStack } from "../lib/backend-stack";
import { FrontendStack } from "../lib/frontend-stack";

const app = new cdk.App();
const env = {
  account: "355037942502",
  region: "ca-central-1",
};

new BackendStack(app, "BackendStack", { env });

new FrontendStack(app, "FrontendStack", { env });
