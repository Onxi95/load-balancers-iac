
variable "subnets" {
  description = "A map of subnets with cidr_blocks and availability zones"
  type        = map(object({
    cidr_block        = string
    availability_zone = string
  }))
}

variable "vpc_id" {
  description = "The VPC ID where the subnets will be created"
  type        = string
}
