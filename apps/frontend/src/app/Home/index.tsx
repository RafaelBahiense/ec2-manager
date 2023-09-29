import { useAuthContext } from "@/hooks/useAuthContext";
import { useEffect, useState } from "react";
import { Table } from "antd";

type Ec2Instance = {
  InstanceId: string;
  InstanceType: string;
  LaunchTime: string;
  State: string;
  PrivateIpAddress: string;
};

type ListEc2InstancesResponse = {
  instances: Ec2Instance[];
};

export default function Home() {
  const { user } = useAuthContext();
  const [instances, setInstances] = useState<Ec2Instance[]>([]);

  useEffect(() => {
    async function fetchInstances() {
      const data = await listEc2Instances();
      console.log(data);
      setInstances(data.instances);
    }

    fetchInstances();
  }, []);

  const columns = [
    {
      title: "Instance ID",
      dataIndex: "InstanceId",
      key: "InstanceId",
    },
    {
      title: "Instance Type",
      dataIndex: "InstanceType",
      key: "InstanceType",
    },
    {
      title: "Launch Time",
      dataIndex: "LaunchTime",
      key: "LaunchTime",
    },
    {
      title: "State",
      dataIndex: "State",
      key: "State",
    },
    {
      title: "Private IP Address",
      dataIndex: "PrivateIpAddress",
      key: "PrivateIpAddress",
    },
  ];

  return (
    <div className="p-8">
      <div className="flex items-center mb-6">
        <img
          src={user?.picture}
          alt={user?.name}
          className="w-12 h-12 rounded-full mr-4"
        />
        <h1 className="text-xl font-bold">Olá {user?.name}</h1>
      </div>

      <Table dataSource={instances} columns={columns} rowKey="instanceId" />
    </div>
  );
}

async function listEc2Instances(): Promise<ListEc2InstancesResponse> {
  const response = await fetch(import.meta.env.VITE_API_URL + "ec2/list", {
    method: "GET",
    credentials: "include",
  });
  const data = await response.json();

  return data;
}
