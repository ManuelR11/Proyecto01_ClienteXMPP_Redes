# Proyecto01_ClienteXMPP_Redes
# XMPP Instant Messaging Client Project

## Project Description

This project aims to implement an instant messaging client that supports the XMPP protocol. Through this project, the goal is to understand the purpose and functionality of XMPP protocol services, as well as to apply acquired knowledge in web and mobile programming alongside proper development practices.

## Objectives

- Implement a protocol based on standards.
- Understand the purpose of the XMPP protocol.
- Learn how XMPP protocol services work.
- Apply acquired knowledge in web and mobile programming.

## Features

The developed messaging client supports the following features, organized into two main categories:

### 1. Account Management

1. **Register a new account on the serverr**
2. **Log in with an existing account**
3. **Log out**
4. **Delete the account from the server**

### 2. Communication

1. **Show all users/contacts and their status**
2. **Add a user to contacts**
3. **Display contact details of a user**
4. **One-to-one communication with any user/contact**
5. **Participate in group conversations**
6. **Set a presence message**
7. **Send/receive notifications**
8. **Send/receive files**

## Requirements

- React.js
- XMPP Client (`@xmpp/client`)
- Connection to a compatible XMPP server, such as `alumchat.lol`.

## Project Structure

The project is organized as follows:

- **Components:**
  - `Navbar`: Navigation bar component.
  - `Login`: Component for handling login.
  - `Users`: Component that displays the contact list.
  - `Sidebar`: Sidebar component where the main functionalities are managed.
  - `SearchBox`: Component for searching users or messages.
  - `ChatPerson`: Component for managing one-to-one communication.

- **Styles:**
  - `chat.css`: CSS file for the main chat styles.

- **Main Function:**
  - `initializeXmppClient`: Initializes and manages XMPP connections.
  - `addContact`: Adds new contacts.
  - `handleSearch`: Manages the search for contacts and messages.
  - `sendMessages`: Sends text messages.
  - `handleFileSend`: Sends files through the chat.
  - `handleNotificationResponse`: Responds to contact requests.
  - `handleLogout`: Manages logout.
  - `DeleteAcount`: Deletes the account from the server.
  
## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ManuelR11/Proyecto01_ClienteXMPP_Redes
    ```
2. **Install dependencies:**
   ```bash
   npm install
    ```
3. **Start the application:**
   ```bash
   npm start
    ```

## Usage
Upon starting the application, users can register, log in, and start chatting with other users connected to the XMPP server. Additional features such as file sending, presence management, and participation in group conversations are available from the main interface of the application.

## Credits
Manuel Rodas 21509
