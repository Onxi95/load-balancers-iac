import * as aws from "@pulumi/aws";
import { vpc } from "./vpc";
import * as pulumi from "@pulumi/pulumi";
import { subnets } from "./subnets";

export const gateway = new aws.ec2.InternetGateway("gateway", {
  vpcId: vpc.id,
});

const routeTable = new aws.ec2.RouteTable("routeTable", {
  vpcId: vpc.id,
  routes: [
    {
      cidrBlock: "0.0.0.0/0",
      gatewayId: gateway.id,
    },
  ],
});

export const routeTableAssociations = subnets.map(
  (subnet, i) =>
    new aws.ec2.RouteTableAssociation(`routeTableAssociation-${i}`, {
      subnetId: subnet.id,
      routeTableId: routeTable.id,
    })
);
