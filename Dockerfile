FROM node:12.16-stretch

MAINTAINER Yu Eguchi

WORKDIR /opt/app/api/

# アプリケーションの依存関係をインストールする
# ワイルドカードを使用して、package.json と package-lock.json の両方が確実にコピーされるようにします。
# 可能であれば (npm@5+)
COPY package*.json ./

RUN npm install
# 本番用にコードを作成している場合
# RUN npm install --only=production
COPY . /opt/app/api

EXPOSE 8080

CMD npm run start:dev
