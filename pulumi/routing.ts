import * as aws from "@pulumi/aws";
import type { Output } from "@pulumi/pulumi";

export const createRouting = ({
  vpcId,
  subnetIds,
}: {
  vpcId: Output<string>;
  subnetIds: Output<string>[];
}) => {
  const gateway = new aws.ec2.InternetGateway("gateway", {
    vpcId,
  });

  const routeTable = new aws.ec2.RouteTable("routeTable", {
    vpcId,
    routes: [
      {
        cidrBlock: "0.0.0.0/0",
        gatewayId: gateway.id,
      },
    ],
  });

  const routeTableAssociations = subnetIds.map(
    (subnetId, i) =>
      new aws.ec2.RouteTableAssociation(`routeTableAssociation-${i}`, {
        subnetId,
        routeTableId: routeTable.id,
      })
  );

  return gateway;
};
