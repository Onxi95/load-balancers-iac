import * as aws from "@pulumi/aws";
import { vpc } from "./vpc";

export const securityGroup = new aws.ec2.SecurityGroup("secGroup", {
  description: "Enable HTTP access",
  vpcId: vpc.id,
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
