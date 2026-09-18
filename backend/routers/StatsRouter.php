<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/stats.php';

class StatsRouter extends Router
{
    private $stats;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->stats = new stats($conn);
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'invitations') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getInvitations(1, $y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'cvcount') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getCvCount($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'practices') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getAllPractices($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getStatBySYears') {
            $this->output($this->stats->getStatBySYears());
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllCVInvitations') {
            $this->output($this->stats->getAllCVInvitations());
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getFirmStats') {
            $this->output($this->stats->getFirmStats());
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'export') {
            $this->output($this->stats->export());
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllWSs') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getAllWSs($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllGifts') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getAllGifts($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllMeets') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getAllMeets($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getTopCompanies') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getTopCompanies($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllNotActivity') {
            if (isset($uri[3]))
                $y = intval($uri[3]);
            else
                $y = 0;
            $this->output($this->stats->getAllNotActivity($y));
        } else if (isset($uri[1]) && $uri[1] === 'stats') {
            $this->output($this->stats->getAll());
        }
    }
}