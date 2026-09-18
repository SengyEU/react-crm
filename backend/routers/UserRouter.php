<?php

require_once __DIR__ . '/Router.php';

class UserRouter extends Router
{
    protected function get($uri, $input)
    {
        if (isset($_SESSION["user"])) {
            if ($_SESSION["user"] != null)
                $this->output(array("user" => $_SESSION["user"]));
            else
                $this->output(array("user" => "reader"));
        } else { // jen pro localhost
            if (isset($_COOKIE['localhostUser'])) {
                $user = $_COOKIE['localhostUser'];
                switch ($user) {
                    case 'admin':
                        $this->output(array("user" => "admin"));
                        break;

                    case 'user':
                        $this->output(array("user" => "reader"));
                        break;
                }
            } else {
                $this->output(array("user" => "admin")); // jinak mne to odhlásí.
            }
        }
    }
}