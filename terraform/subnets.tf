locals {
  subnets = {
    a = {
      cidr_block        = "10.0.1.0/24"
      availability_zone = "us-east-1a"
    }
    b = {
      cidr_block        = "10.0.2.0/24"
      availability_zone = "us-east-1b"
    }
  }
}

resource "aws_subnet" "public" {
  for_each = local.subnets

  vpc_id            = aws_vpc.custom_vpc.id
  cidr_block        = each.value.cidr_block
  availability_zone = each.value.availability_zone
}
