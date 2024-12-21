import * as pulumi from "@pulumi/pulumi";
import { createLoadBalancer } from "./loadBalancer";
import { createRouting } from "./routing";
import { createVpc } from "./vpc";
import { createSecurityGroup } from "./securityGroup";
import { createSubnets } from "./subnets";
import { createServers } from "./servers";

const vpc = createVpc();

const subnet = createSubnets({
  vpcId: vpc.id,
  subnetConfig: [
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
  ],
});
const subnetIds = subnet.map((subnet) => subnet.id);

const securityGroup = createSecurityGroup({ vpcId: vpc.id });

const servers = createServers({
  securityGroupId: securityGroup.id,
  instanceConfig: subnetIds.map((subnetId, i) => ({
    name: String.fromCharCode(i + "a".charCodeAt(0)),
    httpMessage: `Hello from instance ${i + 1}`,
    subnetId,
  })),
});
const serverIds = servers.map((server) => server.id);

const loadBalancer = createLoadBalancer({
  vpcId: vpc.id,
  securityGroupId: securityGroup.id,
  serverIds,
  subnetIds,
});

const gateway = createRouting({
  vpcId: vpc.id,
  subnetIds,
});

export const url = pulumi.interpolate`http://${loadBalancer.dnsName}`;
