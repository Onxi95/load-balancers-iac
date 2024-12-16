import * as pulumi from "@pulumi/pulumi";
import { loadBalancer } from "./loadBalancer";
import { gateway } from "./routing";

export const url = pulumi.interpolate`http://${loadBalancer.dnsName}`;
export const gatewayArn = pulumi.interpolate`http://${gateway.arn}`;
