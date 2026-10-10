<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/workshops.php';

class WorkshopsRouter extends Router
{
    private $workshops;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->workshops = new workshops($conn);

        $this->get('workshops/{id?}', fn($p) => $this->workshops->getworkshops($p['id'] ?? null));
        $this->post('workshops', fn($p, $in) => $this->workshops->insert($in));
        $this->put('workshops', fn($p, $in) => $this->workshops->update($in));
        $this->delete('workshops/{id?}', fn($p) => $this->workshops->delete($p['id'] ?? null));
    }
}
