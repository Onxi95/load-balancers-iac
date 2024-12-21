import * as aws from "@pulumi/aws";
import type { Output } from "@pulumi/pulumi";

type SubnetConfig = {
  name: string;
  cidrBlock: string;
  availabilityZone: `us-east-1${"a" | "b"}`;
};

export const createSubnets = ({
  vpcId,
  subnetConfig,
}: {
  vpcId: Output<string>;
  subnetConfig: SubnetConfig[];
}) => {
  const subnets = subnetConfig.map(
    (subnet) =>
      new aws.ec2.Subnet(subnet.name, {
        vpcId,
        cidrBlock: subnet.cidrBlock,
        mapPublicIpOnLaunch: true,
        availabilityZone: subnet.availabilityZone,
      })
  );

  return subnets;
};
