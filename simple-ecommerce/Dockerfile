# 使用 Node.js 官方镜像作为基础镜像
FROM node:20

# 设置工作目录
WORKDIR /usr/src/app

# 将 package.json 和 package-lock.json 复制到工作目录
COPY package*.json ./

# 安装应用依赖
RUN npm install
# 将 prisma 文件夹复制到工作目录（确保 prisma/schema.prisma 存在）
COPY prisma ./prisma
# 在容器中生成 Prisma 客户端
RUN npx prisma generate

# 将项目文件复制到工作目录
COPY . .

# 构建 Nest.js 应用
RUN npm run build

# 暴露应用端口
EXPOSE 3000

# 运行 Nest.js 应用
CMD ["node", "dist/main"]