-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2021. Okt 19. 23:14
-- Kiszolgáló verziója: 10.4.20-MariaDB
-- PHP verzió: 8.0.9

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `214szft_lepesszamlalo`
--
CREATE DATABASE IF NOT EXISTS `214szft_lepesszamlalo` DEFAULT CHARACTER SET utf8 COLLATE utf8_hungarian_ci;
USE `214szft_lepesszamlalo`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `stepdata`
--

CREATE TABLE `stepdata` (
  `ID` int(11) NOT NULL,
  `userID` int(11) NOT NULL,
  `data` date NOT NULL,
  `stepcount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

CREATE TABLE `users` (
  `ID` int(11) NOT NULL,
  `username` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `email` varchar(100) COLLATE utf8_hungarian_ci NOT NULL,
  `password` varchar(40) COLLATE utf8_hungarian_ci NOT NULL,
  `reg` datetime NOT NULL,
  `last` datetime DEFAULT NULL,
  `rights` varchar(20) COLLATE utf8_hungarian_ci NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`ID`, `username`, `email`, `password`, `reg`, `last`, `rights`, `status`) VALUES
(11, 'Erik', 'erik@erik.hu', '5f5ea3800d9a62bc5a008759dbbece9cad5db58f', '2021-10-13 13:56:44', NULL, 'admin', 1),
(16, 'Tiltott', 'tiltott@tiltott.hu', 'fc98798a924c514d7627761ae100af2c17252321', '2021-10-19 21:07:27', NULL, 'user', 0),
(17, 'Tamas', 'tamas@tamas.hu', '42bdcfc19b7d8fb231ed6ec090bd47fce280b58c', '2021-10-19 21:09:03', NULL, 'user', 1);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `stepdata`
--
ALTER TABLE `stepdata`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `userID` (`userID`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`ID`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `stepdata`
--
ALTER TABLE `stepdata`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `stepdata`
--
ALTER TABLE `stepdata`
  ADD CONSTRAINT `stepdata_ibfk_1` FOREIGN KEY (`userID`) REFERENCES `users` (`ID`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
