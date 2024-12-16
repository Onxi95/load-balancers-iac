import * as aws from "@pulumi/aws";
import { vpc } from "./vpc";

const subnetsData = [
  {
    name: "a",
    cidrBlock: "10.0.1.0/24",
    availabilityZone: "us-east-1a",
  },
  {
    name: "b",
    cidrBlock: "10.0.2.0/24",
    availabilityZone: "us-east-1b",
  },
];

export const subnets = subnetsData.map(
  (subnet) =>
    new aws.ec2.Subnet(subnet.name, {
      vpcId: vpc.id,
      cidrBlock: subnet.cidrBlock,
      mapPublicIpOnLaunch: true,
      availabilityZone: subnet.availabilityZone,
    })
);
