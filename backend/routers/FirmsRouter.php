<?php

require_once __DIR__ . '/Router.php';
require_once __DIR__ . '/../firms/firms.php';

class FirmsRouter extends Router
{
    private $firms;

    public function __construct($conn)
    {
        parent::__construct($conn);
        $this->firms = new firms($conn);
    }

    protected function get($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'checkfirmExist') {
            $this->output($this->firms->checkIfFirmExist($uri[2]));
        } else if (isset($uri[2]) && $uri[2] === 'list' && isset($uri[3]) && $uri[3] === 'filter') {
            $this->output($this->firms->getFirmsFilter($_GET));
        } else if (isset($uri[2]) && $uri[2] === 'list') {
            $this->output($this->firms->getFirms());
        } else if (isset($uri[2]) && $uri[2] === 'getFirmsNotCont') {
            $this->output($this->firms->getFirmsNotCont());
        } else if (isset($uri[2]) && $uri[2] === 'form') { // parametry formuláře
            if (isset($uri[3]))
                $this->output($this->firms->getFirmAndForm($uri[3]));
            else
                $this->output($this->firms->getFirmForm());
        } else if (isset($uri[1]) && $uri[1] === 'firm' && isset($uri[2]) && $uri[2] === 'contactsList') {
            $this->output($this->firms->contactsList());
        } else if (isset($uri[1]) && $uri[1] === 'firm') {
            $this->output($this->firms->getFirm($uri[2]));
        } else if (isset($uri[1]) && $uri[1] === 'columnsFilter') {
            $this->output($this->firms->getColmVisibilityFilter());
        } else if (isset($uri[1]) && $uri[1] === 'columns') {
            $this->output($this->firms->getColmVisibility());
        } else if (isset($uri[1]) && $uri[1] === 'columnsList') {
            $this->output($this->firms->getColms());
        }
    }

    protected function post($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'firms') {
            $this->output($this->firms->insert($input));
        } else if (isset($uri[1]) && $uri[1] === 'columns') {
            $this->output($this->firms->saveColmVisibility($input));
        } else if (isset($uri[1]) && $uri[1] === 'column') {
            $this->output($this->firms->addColm($input["name"], $input["type"]));
        }
    }

    protected function put($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'firms') {
            $this->output($this->firms->updateFirm($input));
        } else if (isset($uri[1]) && $uri[1] === 'column') {
            $this->output($this->firms->updateColmn($input));
        }
    }

    protected function delete($uri, $input)
    {
        if (isset($uri[1]) && $uri[1] === 'firms') {
            $this->output($this->firms->delete($uri[2]));
        } else if (isset($uri[1]) && $uri[1] === 'column') {
            $this->output($this->firms->deleteColmn($uri[2]));
        }
    }
}