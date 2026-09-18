<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/cvinvitations.php';

class CvInvitationsRouter extends Router
{
    private $cvInvitations;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->cvInvitations = new cvInvitations($conn);
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'cvinvitations') {
            $this->output($this->cvInvitations->getcvIvnvitatios($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'cvinvitations') {
            $this->output($this->cvInvitations->save($input));
        }
    }
}