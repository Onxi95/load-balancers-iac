import * as pulumi from "@pulumi/pulumi";
import * as aws from "@pulumi/aws";

const config = new pulumi.Config();
const vpcNetworkCidr = config.get("vpcNetworkCidr") || "10.0.0.0/16";

export const vpc = new aws.ec2.Vpc("vpc", {
  cidrBlock: vpcNetworkCidr,
  enableDnsHostnames: true,
  enableDnsSupport: true,
});
