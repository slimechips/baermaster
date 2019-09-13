#!/bin/bash

main () {
    installMake
    installNode
    installForever
    installAngular
}

copyFiles () {
    echo "Copying files and making directories..."
    cp xStartAll.sh ../../xStartAll.sh
    cp xStopAll.sh ../../xStopAll.sh
    if [ ! -d "logs" ]; then
        mkdir logs
    fi
    cd ..
    cp -r etc ../etc
}

installMake () {
    echo "Installing Make & Build Essentials"
    apt-get update
    echo yes | apt-get install python g++ make build-essential
}

installNode () {

    node -v
    if [ $? == 0 ]; then
        echo "Node is Installed, skipping Installation..."
        return
    fi

    wget https://nodejs.org/dist/v10.16.0/node-v10.16.0-linux-x64.tar.xz
    if [ $? != 0 ]; then
        exit 1
    fi
    echo "Unzipping Node..."
    if [ $? != 0 ]; then
        exit 1
    fi
    echo "Installing Node..."
    VERSION=v10.16.0
    DISTRO=linux-x64
    mkdir -p /usr/local/lib/nodejs
    tar -xJvf node-$VERSION-$DISTRO.tar.xz -C /usr/local/lib/nodejs
    sleep 1
    VERSION=v10.16.0
    DISTRO=linux-x64
    rm /usr/bin/node /usr/bin/npm /usr/bin/npx
    export PATH=/usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin:$PATH
    ln -s /usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin/node /usr/bin/node
    ln -s /usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin/npm /usr/bin/npm
    ln -s /usr/local/lib/nodejs/node-$VERSION-$DISTRO/bin/npx /usr/bin/npx
    if [ $? != 0 ]; then
        exit 1
    fi
    . ~/.profile
    rm node-$VERSION-$DISTRO.tar.xz
    node -v
    if [ $? != 0 ]; then
        exit 1
    fi
    npm version
    if [ $? != 0 ]; then
        exit 1
    fi
}

installForever () {
    echo "Installing forever..."
    echo yes | npm i -g forever
}

installAngular () {
    echo "Installing Angular..."
    echo yes | npm i -g @angular/cli
}

installPinentry () {
    echo "Donwloading Pinentry..."
    wget https://gnupg.org/ftp/gcrypt/pinentry/pinentry-1.1.0.tar.bz2
    if [ $? != 0 ]; then
        exit 1
    fi
    echo "Unzipping Pinetry..."
    if [ $? != 0 ]; then
        exit 1
    fi
    tar xf pinentry-*.tar.bz2 && rm pinentry-*.tar.bz2 && cd pinentry-*/
    if [ $? != 0 ]; then
        exit 1
    fi
    echo "Installing Pinetry..."
    echo yes | apt-get install gtk2.0 libgtk2.0-dev gcr libgcr-3-dev libsecret-1-0 libqt4-dev
    ./configure
    if [ $? != 0 ]; then
        exit 1
    fi
    make
    if [ $? != 0 ]; then
        exit 1
    fi
    make check
    if [ $? != 0 ]; then
        exit 1
    fi
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r pinentry-*/
}

installGnuPG () {
    installGnuPGLibs
    installPinentry
    echo "Downloading GnuPG..."
    wget https://www.gnupg.org/ftp/gcrypt/gnupg/gnupg-2.2.17.tar.bz2
    if [ $? != 0 ]; then
        exit 1
    fi
    echo "Unzipping GnuPG..."
    tar xf gnupg-*.tar.bz2 && rm gnupg-*.tar.bz2 && cd gnupg-*/
    echo "Installing GnuPG.."
    ./configure
    if [ $? != 0 ]; then
        exit 1
    fi
    make
    if [ $? != 0 ]; then
        exit 1
    fi
    make check
    make install
    if [ $? != 0 ]; then    
        exit 1
    fi
    cd .. && rm -r gnupg-*/
}

installGnuPGLibs () {

    echo "Installing zlib1g-dev"
    apt install zlib1g-dev
    if [ $? != 0 ]; then
        exit 1
    fi

    echo "Installing Libgpg-error"
    wget https://gnupg.org/ftp/gcrypt/libgpg-error/libgpg-error-1.36.tar.bz2
    tar xf libgpg-*.tar.bz2 && rm libgpg-*.tar.bz2 && cd libgpg-*/
    ./configure
    make
    make check
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r libgpg-*/

    echo "Installing Libgcrpyt"
    wget https://gnupg.org/ftp/gcrypt/libgcrypt/libgcrypt-1.8.4.tar.bz2
    tar xf libgcrypt-*.tar.bz2 && rm libgcrypt-*.tar.bz2 && cd libgcrypt-*/
    ./configure
    make
    make check
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r libgcrypt-*/

    echo "Installing Libksba"
    wget https://gnupg.org/ftp/gcrypt/libksba/libksba-1.3.5.tar.bz2
    tar xf libksba-*.tar.bz2 && rm libksba-*.tar.bz2 && cd libksba-*/
    ./configure
    make
    make check
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r libksba-*/

    echo "Installing Libassuan"
    wget https://gnupg.org/ftp/gcrypt/libassuan/libassuan-2.5.3.tar.bz2
    tar xf libassuan-*.tar.bz2 && rm libassuan-*.tar.bz2 && cd libassuan-*/
    ./configure
    make
    make check
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r libassuan-*/

    echo "Installing ntbTLS"
    wget https://gnupg.org/ftp/gcrypt/ntbtls/ntbtls-0.1.2.tar.bz2
    tar xf ntbtls-*.tar.bz2 && rm ntbtls-*.tar.bz2 && cd ntbtls-*/
    ./configure
    make
    make check
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r ntbtls-*/

    echo "Installing nPth"
    wget https://gnupg.org/ftp/gcrypt/npth/npth-1.6.tar.bz2
    tar xf npth-*.tar.bz2 && rm npth-*.tar.bz2 && cd npth-*/
    ./configure
    make
    make check
    make install
    if [ $? != 0 ]; then
        exit 1
    fi
    cd .. && rm -r npth-*/
}

installGitSecret () {
    installGnuPG
    git clone https://github.com/sobolevn/git-secret.git git-secret
    cd git-secret && make build
    PREFIX="/usr/local" make install
    cd .. && rm -r git-secret
}

cd ..
main
