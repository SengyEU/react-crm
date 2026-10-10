<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/meets.php';

class MeetsRouter extends Router
{
    private $meets;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->meets = new meets($conn);

        $this->get('meets/{id?}', fn($p) => $this->meets->getMeets($p['id'] ?? null));
        $this->post('meets', fn($p, $in) => $this->meets->insert($in));
        $this->put('meets', fn($p, $in) => $this->meets->update($in));
        $this->delete('meets/{id?}', fn($p) => $this->meets->delete($p['id'] ?? null));
    }
}
