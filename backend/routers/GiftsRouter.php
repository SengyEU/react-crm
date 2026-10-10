<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/gifts.php';

class GiftsRouter extends Router
{
    private $gifts;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->gifts = new gifts($conn);

        $this->get('gifts/{id?}', fn($p) => $this->gifts->getgifts($p['id'] ?? null));
        $this->post('gifts', fn($p, $in) => $this->gifts->insert($in));
        $this->put('gifts', fn($p, $in) => $this->gifts->update($in));
        $this->delete('gifts/{id?}', fn($p) => $this->gifts->delete($p['id'] ?? null));
    }
}
