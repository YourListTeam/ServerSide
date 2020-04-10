CREATE TABLE Users (
    UUID varchar(36) PRIMARY KEY,
    username varchar(64),
    Name varchar(32),
    HomeLocation varchar(64),
    Email varchar(64),
    Picture BYTEA
);
CREATE TABLE Lists (
    LID varchar(36) PRIMARY KEY,
    listname varchar(32),
    Colour varchar(32),
    Modified date
);
CREATE TABLE Auth (
    UUID varchar(36),
    LID varchar(36),
    Permission bit(4),
    PRIMARY KEY (UUID, LID),
    FOREIGN KEY (UUID) REFERENCES Users(UUID) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (LID) REFERENCES Lists(LID)  ON DELETE CASCADE
);

CREATE TABLE Items (
    IID varchar(36) PRIMARY KEY,
    UUID varchar(36),
    LID varchar(36),
    Name varchar(32),
    Completed boolean,
    Modified date,
    FOREIGN KEY (LID) REFERENCES Lists(LID)
);

CREATE TABLE Favorites (
    UUID varchar(36),
    LID varchar(36),
    FOREIGN KEY (UUID) REFERENCES Users(UUID),
    FOREIGN KEY (LID) REFERENCES Lists(LID)
);
CREATE TABLE Contacts (
    User_UUID varchar(36),
    Contact_UUID varchar(36),
    FOREIGN KEY (User_UUID) REFERENCES Users(UUID),
    FOREIGN KEY (Contact_UUID) REFERENCES Users(UUID)
);

CREATE TABLE Locations(
    LID varchar(36),
    Address point,
    AddressName varchar(64),
    Name varchar(64),
    FOREIGN KEY (LID) REFERENCES Lists(LID)
);