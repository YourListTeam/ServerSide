CREATE TABLE Auth (
    User char(36) CHECK (
    User in (SELECT UUID FROM Users)),
    LID char(36),
    Permissions binary[4],
    FOREIGN KEY (LID),
    REFERENCES Lists (LID),
    ON UPDATE CASCADE,
    ON DELETE CASCADE CHECK (Permissions>=8)
);
CREATE TABLE Users (
    UUID char(36) PRIMARY KEY,
    username varchar(10)
    Name varchar(20)
    Email varchar(50),
    Picture varbinary(50)
);
CREATE TABLE Lists (
    LID char(36),
    Name varchar(10),
    Colour char(11),
    Modified date
    OID char (36),
    FOREIGN KEY (OID),
    REFERENCES Item (OID)
);
CREATE TABLE Item (
    OID char(36),
    Name varchar(10),
    Completed binary,
    Modified date
);
CREATE TABLE Favorites (
    UUID char(36),
    LID char(36)
);
CREATE TABLE Contacts (
    User_UUID char(36),
    Contact_UUID char(36)
);
CREATE TABLE Locations(
    LID char(36),
    Address point,
    FOREIGN KEY (LID),
    REFERENCES Lists (LID)
);