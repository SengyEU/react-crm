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

        $year = fn($p) => intval($p['year'] ?? 0);

        $this->get('stats/invitations/{year?}', fn($p) => $this->stats->getInvitations(1, $year($p)));
        $this->get('stats/cvcount/{year?}', fn($p) => $this->stats->getCvCount($year($p)));
        $this->get('stats/practices/{year?}', fn($p) => $this->stats->getAllPractices($year($p)));
        $this->get('stats/getStatBySYears', fn() => $this->stats->getStatBySYears());
        $this->get('stats/getAllCVInvitations', fn() => $this->stats->getAllCVInvitations());
        $this->get('stats/getFirmStats', fn() => $this->stats->getFirmStats());
        $this->get('stats/export', fn() => $this->stats->export());
        $this->get('stats/getAllWSs/{year?}', fn($p) => $this->stats->getAllWSs($year($p)));
        $this->get('stats/getAllGifts/{year?}', fn($p) => $this->stats->getAllGifts($year($p)));
        $this->get('stats/getAllMeets/{year?}', fn($p) => $this->stats->getAllMeets($year($p)));
        $this->get('stats/getTopCompanies/{year?}', fn($p) => $this->stats->getTopCompanies($year($p)));
        $this->get('stats/getAllNotActivity/{year?}', fn($p) => $this->stats->getAllNotActivity($year($p)));
        $this->get('stats', fn() => $this->stats->getAll());
    }
}
