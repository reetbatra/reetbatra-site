---
title: "Step-by-Step: Setting Up Cairo Development on Windows for Starknet"
date: "2025-04-01"
brief: "So, you’ve been Cairo-curious, huh? Maybe you’re building the next big thing on Starknet or trying to flex with some ZK-powered smart contracts."
topic: protocols
original: "https://reet.hashnode.dev/step-by-step-setting-up-cairo-development-on-windows-for-starknet"
---

So, you’ve been Cairo-curious, huh? Maybe you’re building the next big thing on Starknet or trying to flex with some ZK-powered smart contracts. Whatever your goal is — if you’re on Windows, you’ll need to jump through a few hoops to get started with **Cairo**.

But don’t worry — this step-by-step tutorial will guide you through:

• Installing **WSL (Windows Subsystem for Linux)**

• Setting up **Ubuntu**

• Installing **ASDF** (tool version manager)

• Installing **Scarb** (Cairo’s package manager)

• Verifying that everything works and running your first Cairo project 🎉

## **🧱 Why all this setup?**

Cairo runs best in a Unix-like environment. Windows doesn’t natively support the tooling, so we use **WSL** to create a Linux sandbox. Then, we use **ASDF** to manage tools like **Scarb**, which is essential for building Cairo projects.

Let’s dive in.

## Step 1: Install WSL (Windows Subsystem for Linux)

WSL lets you run Linux inside Windows like a virtual machine — but faster and smoother.

**✅ Steps:**

1\. **Open PowerShell as Admin**

-   Hit Start → search **PowerShell**

-   Right-click → **Run as Administrator**

2\. **Run this command:**

> This installs WSL and sets Ubuntu as the default Linux distro.

```
wsl --install
```

## Step 2: Set up Ubuntu

After rebooting, **Ubuntu** will auto-launch. If it doesn’t:

-   Search for “Ubuntu” in your Start menu and open it.

The first time it runs:

-   It’ll install some files.

-   You’ll be asked to create a UNIX username and password. This is for your Linux environment (not your Windows login).

✅ Once you see a terminal like:

```
your_username@machine_name:~$
```

You’re ready to go!

## Step 3: Install Homebrew for Linux

We’ll use **Homebrew** to install packages easily inside Ubuntu.

**📦 Steps:**

1\. Run this one-liner to install Homebrew:

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2.  Once installed, **add Homebrew to your shell path**:

```
echo 'eval "$(/home/linuxbrew/.linuxbrew/bin/brew shellenv)"' >> ~/.profile
source ~/.profile
```

3.  Test it:

```
brew --version
```

## Step 3: Install ASDF (Version Manager)

**ASDF** helps manage different versions of tools like Cairo/Scarb. Think of it as nvm or rbenv, but multi-language.

1.  **Install ASDF via Homebrew:**

```
brew install asdf
```

2.  **Configure ASDF in your shell**:

```
echo '. "$(brew --prefix asdf)/libexec/asdf.sh"' >> ~/.bashrc
source ~/.bashrc
```

3.  Test it:

```
asdf --version
```

## Step 5: Install Scarb (Cairo Package Manager)

Now comes the fun part - getting **Scarb** up and running.

### What is Scarb?

Scarb is Cairo’s official package manager. It lets you:

• Create projects

• Manage dependencies

• Compile Cairo contracts

### Steps:

1.  **Add the Scarb plugin:**

```
asdf plugin add scarb
```

2.  **Install the latest version:**

```
asdf install scarb latest
```

3.  **Set the global version:**

```
asdf global scarb latest
```

4.  **Confirm it’s working:**

```
scarb --version
```

> ⚠️ If scarb is not recognized, try reloading your shell:

```
source ~/.bashrc
```

🎉 You should see something like Scarb 2.9.2 — success!

## **Step 6: Test Your Setup by Creating a Cairo Project**

Now that everything is set up, let’s create your first Cairo project.

**Run:**

```
scarb new hello_cairo
cd hello_cairo
scarb build
```

✅ If no errors occur, Cairo is ready to rock on your Windows machine.

## Step 7: **Add Cairo Support in VS Code**

To get auto-completion and Cairo syntax highlighting in **VS Code**:

1\. Open VS Code

2\. Go to Extensions (Ctrl + Shift + X)

3\. Search **“Cairo Language”**

4\. Install the official extension from the Starkware team

This makes writing and debugging Cairo much easier.

## Bonus tips:

1.  If you ever change versions or install new plugins via ASDF, **restart your shell**:

```
source ~/.bashrc
```

2.  You can install specific versions of Scarb like this:

```
asdf install scarb 2.8.4
asdf global scarb 2.8.4
```

3.  If you want to manage versions **per project**, you can run:

```
asdf local scarb 2.9.2
```

**You Did It!**

You’ve now installed WSL, Ubuntu, Homebrew, ASDF, and Scarb — and created your first Cairo project, all from Windows!

Ready to dive into Cairo development, test smart contracts, and maybe even deploy on Starknet? You’ve got all the tools.

## What’s Next?

-   Check out my full-stack dApp blog on Starknet [here](/writing/end-to-end-starknet-dapp-development-deploying-using-smart-contracts-with-starknetjs), and if you prefer a video tutorial, take a look [here](https://x.com/i/broadcasts/1vOxwXzRoPRKB).

See you on the STARK side! Ta-da.
