FROM couchbase:latest

RUN echo "* soft nproc 20000\n"\
"* hard nproc 20000\n"\
"* soft nofile 200000\n"\
"* hard nofile 200000\n" >> /etc/security/limits.conf

RUN apt-get -qq update && \
    apt-get install -yq libz-dev sudo


RUN curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -

RUN apt update && apt upgrade && apt install -y nodejs npm

RUN addgroup --gid 33333 gitpod && \
     useradd --no-log-init --create-home --home-dir /home/gitpod --shell /bin/bash --uid 33333 --gid 33333 gitpod && \
     usermod -a -G gitpod,couchbase,sudo gitpod && \
     echo 'gitpod ALL=(ALL) NOPASSWD:ALL'>> /etc/sudoers

COPY startcb.sh /opt/couchbase/bin/startcb.sh
USER gitpod

#
#FROM gitpod/workspace-full:latest
#
#RUN bash -c ". .nvm/nvm.sh     && nvm install 16     && nvm use 16     && nvm alias default 16"
#
#RUN echo "nvm use default &>/dev/null" >> ~/.bashrc.d/51-nvm-fix
