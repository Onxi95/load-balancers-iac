import * as aws from "@pulumi/aws";
import type { Output } from "@pulumi/pulumi";

export const createSecurityGroup = ({ vpcId }: { vpcId: Output<string> }) => {
  const securityGroup = new aws.ec2.SecurityGroup("secGroup", {
    vpcId,
    ingress: [
      {
        fromPort: 80,
        toPort: 80,
        protocol: "tcp",
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
    egress: [
      {
        fromPort: 0,
        toPort: 0,
        protocol: "-1",
        cidrBlocks: ["0.0.0.0/0"],
      },
    ],
  });

  return securityGroup;
};
