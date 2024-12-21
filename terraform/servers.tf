locals {
  instances = {
    a = {
      subnet_key = "a"
      message    = "Hello from instance 1"
    }
    b = {
      subnet_key = "b"
      message    = "Hello from instance 2"
    }
  }
}

resource "aws_instance" "servers" {
  for_each = local.instances

  ami                         = "ami-0453ec754f44f9a4a"
  instance_type               = "t2.micro"
  subnet_id                   = aws_subnet.public[each.value.subnet_key].id
  vpc_security_group_ids      = [aws_security_group.security_group.id]
  associate_public_ip_address = true

  user_data = <<-EOF
              #!/bin/bash
              yum install -y httpd
              systemctl start httpd
              systemctl enable httpd
              echo "${each.value.message}" > /var/www/html/index.html
              EOF
}
