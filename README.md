# 1.简介

后端 yadmin 基于springboot 开发后台<br>
前端 yadmin 基于vue3 + ts + element plus 开发

# 2. 目录结构

```text
yadmin-server                                # 后端代码
├── yadmin-application
│   └── yadmin-application-monitor           # spring-boot-admin监控
│   └── yadmin-application-admin             # 后台应用
│       └── modules                          # 后台应用模块
│           └── generator                    # 代码生成器模块
│           └── quartz                       # 定时任务模块
│           └── system                       # 后台rbac模块
├── yadmin-common                            # 公共库
│   └── yadmin-common-core                   # 基础库
│   └── yadmin-common-db                     # 存放dao和model
├── yadmin-tools                             # 工具库-独立模块
│   └── yadmin-tools-document                # knife4j 文档整合             
│   └── yadmin-tools-security                # spring security + jwt 安全
│   └── yadmin-tools-log                     # 操作日志
│   └── yadmin-tools-mp-query                # mybatis-plus 条件查询
```
# 3.注意
修改mapstruct 衍射的类 maven 要 clean
# 4.截图
![image-01](https://php-yangyi-images.oss-cn-shenzhen.aliyuncs.com/yadmin-docs/01.jpg)
