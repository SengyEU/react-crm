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
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'gifts') {
            $this->output($this->gifts->getgifts($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'gifts') {
            $this->output($this->gifts->insert($input));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'gifts') {
            $this->output($this->gifts->update($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'gifts') {
            $this->output($this->gifts->delete($uri[2]));
        }
    }
}