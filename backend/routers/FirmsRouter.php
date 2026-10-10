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

        $this->get('checkfirmExist/{id?}', fn($p) => $this->firms->checkIfFirmExist($p['id'] ?? null));
        $this->get('firms/list/filter', fn() => $this->firms->getFirmsFilter($_GET));
        $this->get('firms/list', fn() => $this->firms->getFirms());
        $this->get('firms/getFirmsNotCont', fn() => $this->firms->getFirmsNotCont());
        $this->get('firms/form/{id}', fn($p) => $this->firms->getFirmAndForm($p['id']));
        $this->get('firms/form', fn() => $this->firms->getFirmForm());
        $this->get('firm/contactsList', fn() => $this->firms->contactsList());
        $this->get('firm/{id?}', fn($p) => $this->firms->getFirm($p['id'] ?? null));
        $this->get('columnsFilter', fn() => $this->firms->getColmVisibilityFilter());
        $this->get('columns', fn() => $this->firms->getColmVisibility());
        $this->get('columnsList', fn() => $this->firms->getColms());

        $this->post('firms', fn($p, $in) => $this->firms->insert($in));
        $this->post('columns', fn($p, $in) => $this->firms->saveColmVisibility($in));
        $this->post('column', fn($p, $in) => $this->firms->addColm($in["name"], $in["type"]));

        $this->put('firms', fn($p, $in) => $this->firms->updateFirm($in));
        $this->put('column', fn($p, $in) => $this->firms->updateColmn($in));

        $this->delete('firms/{id?}', fn($p) => $this->firms->delete($p['id'] ?? null));
        $this->delete('column/{id?}', fn($p) => $this->firms->deleteColmn($p['id'] ?? null));
    }
}
