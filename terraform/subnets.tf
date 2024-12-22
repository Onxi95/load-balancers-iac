module "subnet_module" {
  source = "./subnet_module"

  vpc_id = aws_vpc.custom_vpc.id
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
