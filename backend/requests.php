<?php
require_once "helper.php";

require_once 'routers/Router.php';
require_once 'routers/UserRouter.php';
require_once 'routers/FirmsRouter.php';
require_once 'routers/ContactsRouter.php';
require_once 'routers/CampaignsRouter.php';
require_once 'routers/EventsRouter.php';
require_once 'routers/StatsRouter.php';
require_once 'routers/WorkshopsRouter.php';
require_once 'routers/MeetsRouter.php';
require_once 'routers/GiftsRouter.php';
require_once 'routers/PracticesRouter.php';
require_once 'routers/CvInvitationsRouter.php';

class requests
{
    private $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;

        $url = $_SERVER['REQUEST_URI'];
        $url = str_replace("/rest.php", "", $url); //http://lm/v3/rest.php/firms/list
        $url = str_replace("/v3", "", $url); //http://lm/v3/rest.php/firms/list
        $url = str_replace("//", "/", $url); //http://lm/rest.php/firms/list

        $method = $_SERVER["REQUEST_METHOD"];
        $uri = explode('/', $url);
        if (isset($uri[1]) && $uri[1] === 'session') {
            print_r($_SESSION);
            print_r($_COOKIE);
            exit;
        }

        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        $router = $this->resolveRouter($uri, $method);
        $router->handle($method, $uri, $input);
    }

    private function resolveRouter($uri, $method)
    {
        $supported = array('GET', 'POST', 'PUT', 'DELETE');
        if (!in_array($method, $supported)) {
            return new Router($this->conn);
        }

        $routers = array(
            'user' => 'UserRouter',
            'copyCampaign' => 'CampaignsRouter',
            'campaignAttachment' => 'CampaignsRouter',
            'campaignExport' => 'CampaignsRouter',
            'campaigns' => 'CampaignsRouter',
            'getCampaignContacts' => 'CampaignsRouter',
            'campaignContacts' => 'CampaignsRouter',
            'getCampaignSeindingExport' => 'CampaignsRouter',
            'campaign' => 'CampaignsRouter',
            'firms' => 'FirmsRouter',
            'firm' => 'FirmsRouter',
            'checkfirmExist' => 'FirmsRouter',
            'columnsFilter' => 'FirmsRouter',
            'columns' => 'FirmsRouter',
            'columnsList' => 'FirmsRouter',
            'column' => 'FirmsRouter',
            'list' => 'FirmsRouter',
            'getFirmsNotCont' => 'FirmsRouter',
            'form' => 'FirmsRouter',
            'contacts' => 'ContactsRouter',
            'events' => 'EventsRouter',
            'event' => 'EventsRouter',
            'workshops' => 'WorkshopsRouter',
            'stats' => 'StatsRouter',
            'meets' => 'MeetsRouter',
            'gifts' => 'GiftsRouter',
            'practices' => 'PracticesRouter',
            'cvinvitations' => 'CvInvitationsRouter',
        );

        $key = isset($uri[1]) ? $uri[1] : null;
        if ($key === null || !isset($routers[$key])) {
            return new Router($this->conn);
        }

        $class = $routers[$key];
        return new $class($this->conn);
    }
}