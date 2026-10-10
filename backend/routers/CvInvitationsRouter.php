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

        $this->get('cvinvitations/{id?}', fn($p) => $this->cvInvitations->getcvIvnvitatios($p['id'] ?? null));
        $this->post('cvinvitations', fn($p, $in) => $this->cvInvitations->save($in));
    }
}
