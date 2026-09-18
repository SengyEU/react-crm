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
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'meets') {
            $this->output($this->meets->getMeets($uri[2]));
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'meets') {
            $this->output($this->meets->insert($input));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'meets') {
            $this->output($this->meets->update($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'meets') {
            $this->output($this->meets->delete($uri[2]));
        }
    }
}