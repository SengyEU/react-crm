<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/practice.php';

class PracticesRouter extends Router
{
    private $practices;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->practices = new practices($conn);

        $this->get('practices/{id?}', fn($p) => $this->practices->getpractices($p['id'] ?? 0));
        $this->post('practices', fn($p, $in) => $this->practices->save($in));
        $this->delete('practices/{id?}', fn($p) => $this->practices->delete($p['id'] ?? null));
    }
}
