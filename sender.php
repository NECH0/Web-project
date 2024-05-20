<?php  
    $name = $_POST['name'];
    $phone = $_POST['phone'];
    $email = $_POST['email'];
    $address = $_POST['address'];
    $comments = $_POST['comments'];

    $to = "niechaiev007@bk.ru";
    $data = date ("d.m.Y");
    $time = date ("h:i");
    $from = $email;
    $subject = "Заказ с сайта";

    $msg ="
    Имя: $name /n
    Телефон: $phone /n
    Почта: $email /n
    Адрес: $address /n
    Комментарий: $comments";
    mail($to, $subject, $msg, "From: $to");
?>