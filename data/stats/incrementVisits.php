<?php
    $myfile = fopen("thisContainsEverySingleAddressOfPeopleVisitingThisStupidWebsiteLol.txt", "r") or die("EVERYTHING IS BROKEN");
    $b = (int) fread($myfile,filesize("thisContainsEverySingleAddressOfPeopleVisitingThisStupidWebsiteLol.txt"));
	$b++;
    file_put_contents("thisContainsEverySingleAddressOfPeopleVisitingThisStupidWebsiteLol.txt",$b);
	echo "List is ded";
    fclose($myfile);
?>