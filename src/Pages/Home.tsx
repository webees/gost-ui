/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useCallback, useEffect, useState } from "react";
import {
  DeleteOutlined,
  GlobalOutlined,
  LockOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Checkbox, Col, Flex, Form, Input, Row, Space } from "antd";
import {
  GostApiConfig,
  getLocalServers,
  login,
  deleteLocal,
} from "../uitls/server";

type DataItem = { name: string; state: string };

const LocalServers = () => {
  const [list, setList] = useState<GostApiConfig[]>();
  // const [local, setLocal] = useState<Record<string, GostApiConfig>>();

  const updateList = useCallback(async () => {
    return getLocalServers()
      .then((local) => {
        return local.sort((a, b) => {
          const t1 = a.time || 0;
          const t2 = b.time || 0;
          return t2 - t1;
        });
      })
      .then((list) => setList(list));
  }, []);
  useEffect(() => {
    updateList();
    // getList().then(list=>setList(list))
  }, []);

  return (
    <>
      {list && list?.length > 0 ? (
        <Space direction="vertical" style={{ display: "flex" }}>
          <div>快速连接</div>
          <Row gutter={10}>
            {list.map((item) => {
              return (
                <Col
                  key={item.addr}
                  span={12}
                  title={item.addr}
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  <Flex gap={5} style={{ overflow: "hidden" }}>
                    <a
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        flex: "auto",
                      }}
                      href={`?use=${item.addr}`}
                    >
                      {item.addr}
                    </a>
                    <DeleteOutlined
                      style={{ color: "red" }}
                      onClick={async () => {
                        await deleteLocal(item.addr);
                        updateList();
                      }}
                    />
                  </Flex>
                </Col>
              );
            })}
          </Row>
        </Space>
      ) : null}
    </>
  );
};

const Home: React.FC = () => {
  return (
    <Form
      size="large"
      style={{ width: 380, maxWidth: "100%", boxSizing: "border-box", padding:"0 15px", margin: "0 auto" }}
      layout="horizontal"
      initialValues={{
        baseURL: 'http://',
        save: true
      }}
      onFinish={(value) => {
        let addr: string = value.baseURL;
        if (!/^(https?:)?\/\//.test(addr)) {
          addr = `${location.protocol}//` + addr;
        } else if (/^\/\//.test(addr)) {
          addr = `${location.protocol}` + addr;
        }
        return login(
          {
            addr: addr,
            auth: {
              username: value.username,
              password: value.password,
            },
          },
          value.save
        );
      }}
    >
      <h1>GOST API Manage</h1>
      <h2>首先连接API服务</h2>
      <Form.Item
        name="baseURL"
        rules={[
          {
            required: true,
            message: "请输入API地址",
          },
          // {
          //   type:'url'
          // }
        ]}
      >
        <Input
          placeholder="API baseURL"
          prefix={<GlobalOutlined className={"prefixIcon"} />}
        ></Input>
      </Form.Item>
      <Form.Item name="username">
        <Input
          placeholder="username"
          prefix={<UserOutlined className={"prefixIcon"} />}
        ></Input>
      </Form.Item>
      <Form.Item name="password">
        <Input.Password
          placeholder="password"
          prefix={<LockOutlined className={"prefixIcon"} />}
        ></Input.Password>
      </Form.Item>
      <Form.Item name="save" valuePropName="checked"><Checkbox>保存到本地</Checkbox></Form.Item>
      <Form.Item noStyle>
        <Button block type="primary" htmlType="submit">
          链接
        </Button>
      </Form.Item>
      <LocalServers></LocalServers>
    </Form>
  );
};

export default Home;
