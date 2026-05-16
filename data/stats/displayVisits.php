<?php
    $myfile = fopen("thisContainsEverySingleAddressOfPeopleVisitingThisStupidWebsiteLol.txt", "r") or die("EVERYTHING IS BROKEN");
    echo fread($myfile,filesize("thisContainsEverySingleAddressOfPeopleVisitingThisStupidWebsiteLol.txt"));
    fclose($myfile);
?>