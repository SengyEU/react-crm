
<?php
require_once "helper.php";
require_once 'firms/firms.php';
require 'firms/contacts.php';
require 'firms/workshops.php';
require 'firms/stats.php';
require 'firms/meets.php';
require 'firms/gifts.php';
require 'firms/events.php';
require 'firms/campaign.php';
require 'firms/practice.php';
require 'firms/cvinvitations.php';
require_once "firms/ContactVcfExporter.php";

class requests
{
    private $method;
    private $GETdata;
    private $POSTdata;
    private $ser;
    private $conn;
    private $firms;
    private $contacts;
    private $workshops;
    private $stats;
    private $meets;
    private $gifts;
    private $events;
    private $campaigns;
    private $practices;
    private $cvInvitations;

    public function __construct($conn)
    {
        $this->conn = $conn;
        $this->firms = new firms($conn);
        $this->contacts = new contacts($conn);
        $this->workshops = new workshops($conn);
        $this->stats = new stats($conn);
        $this->meets = new meets($conn);
        $this->gifts = new gifts($conn);
        $this->events = new events($conn);
        $this->campaigns = new campaigns($conn);
        $this->practices = new practices($conn);
        $this->cvInvitations = new cvInvitations($conn);

        $url = $_SERVER['REQUEST_URI'];
        $url = str_replace("/rest.php", "", $url); //http://lm/v3/rest.php/firms/list
        $url = str_replace("/v3", "", $url); //http://lm/v3/rest.php/firms/list
        $url = str_replace("//", "/", $url); //http://lm/rest.php/firms/list

        $this->method = $_SERVER["REQUEST_METHOD"];
        $uri = explode('/', $url);
        if (isset($uri[1]) && $uri[1] === 'session') {
        print_r($_SESSION);
        print_r($_COOKIE);
        exit;
        }

        $raw = file_get_contents('php://input');
        $input = json_decode($raw, true);

        /*if ($input == null)
            $input = $_POST;
*/
        switch ($this->method) {
            case 'GET':
                if (isset($uri[1]) && $uri[1] === 'user') {
                    if (isset($_SESSION["user"])) {
                        if ($_SESSION["user"] != null)
                            $this->output(array("user" => $_SESSION["user"]));
                        else
                            $this->output(array("user" => "reader"));
                    } else {// jen pro localhost
                        if (isset($_COOKIE['localhostUser'])) {
                            $user = $_COOKIE['localhostUser'];
                            switch ($user) {
                                case 'admin':
                                    $this->output(array("user" => "admin"));
                                    break;

                                case 'user':
                                    $this->output(array("user" => "reader"));
                                    break;
                            }
                        } else {
                           $this->output(array("user" => "admin"));// jinak mne to odhlásí.

                        }
                    }
                } else
                if (isset($uri[1]) && $uri[1] === 'copyCampaign' && isset($uri[2])) {
                            $this->output($this->campaigns->copyCampaign($uri[2]));
                        }
                    if (isset($uri[1]) && $uri[1] === 'cvinvitations') {
                        $this->output($this->cvInvitations->getcvIvnvitatios($uri[2]));
                    } else

                        if (isset($uri[1]) && $uri[1] === 'campaignAttachment' && isset($uri[2])) {
                            $this->downloadAttachment($uri[2]);
                            exit;
                        } else
                            if (isset($uri[1]) && $uri[1] === 'campaignExport') {
                                $this->output($this->campaigns->getCampaignExport(isset($uri[2]) ? $uri[2] : 0));
                            } else
                                if (isset($uri[1]) && $uri[1] === 'campaigns' && isset($uri[2]) && $uri[2] === 'getCampaignSending') {
                                    $this->output($this->campaigns->getCampaignSending(isset($uri[3]) ? $uri[3] : 0));
                                } else
                                    if (isset($uri[1]) && $uri[1] === 'campaigns') {
                                        $this->output($this->campaigns->getCampaigns());
                                    } else
                                        if (isset($uri[1]) && $uri[1] === 'getCampaignContacts' && isset($uri[2]) && $uri[2]) {
                                            $this->output($this->campaigns->getCampaignContacts($uri[2]));
                                        } else
                                            if (isset($uri[1]) && $uri[1] === 'campaign' && isset($uri[2]) && $uri[2]) {
                                                $this->output($this->campaigns->getCampaign($uri[2]));
                                            } else
                                                if (isset($uri[1]) && $uri[1] === 'event' && isset($uri[2])) {
                                                    $this->output($this->events->getevent(($uri[2])));
                                                } else
                                                    if (isset($uri[1]) && $uri[1] === 'checkfirmExist') {
                                                        $this->output($this->firms->checkIfFirmExist(($uri[2])));
                                                    } else
                                                        if (isset($uri[1]) && $uri[1] === 'events' && isset($uri[2]) && $uri[2] === 'generateICS') {
                                                            $this->events->generateICS($uri[3]);
                                                        } else
                                                            if (isset($uri[1]) && $uri[1] === 'events' && isset($uri[2]) && $uri[2] === 'getFutureEvents') {
                                                                if (isset($uri[2]))
                                                                    $firm_id = $uri[2];
                                                                else
                                                                    $firm_id = null;
                                                                $this->output($this->events->getFutureEvents());
                                                            } else
                                                                if (isset($uri[1]) && $uri[1] === 'events') {
                                                                    if (isset($uri[2]))
                                                                        $firm_id = $uri[2];
                                                                    else
                                                                        $firm_id = null;
                                                                    $this->output($this->events->getEvents($firm_id));
                                                                } else
                                                                    if (isset($uri[1]) && $uri[1] === 'contacts' && isset($uri[2]) && $uri[2] === 'search') {

                                                                        $this->output($this->contacts->search($uri[3]));
                                                                    } else

                                                                        if (isset($uri[1]) && $uri[1] === 'contacts' && isset($uri[2]) && $uri[2] === 'exportVcf') {

                                                                            $exporter = new ContactVcfExporter($this->conn);
                                                                            $exporter->export($input);
                                                                            exit;

                                                                        } else


                                                                            if (isset($uri[1]) && $uri[1] === 'contacts') {

                                                                                $this->output($this->contacts->getFirmContacts($uri[2]));
                                                                            } else
                                                                                if (isset($uri[2]) && $uri[2] === 'list' && isset($uri[3]) && $uri[3] === 'filter') {
                                                                                    $this->output($this->firms->getFirmsFilter($_GET));
                                                                                } else
                                                                                    if (isset($uri[2]) && $uri[2] === 'list') {
                                                                                        $this->output($this->firms->getFirms());

                                                                                    } else
                                                                                        if (isset($uri[2]) && $uri[2] === 'getFirmsNotCont') {
                                                                                            $this->output($this->firms->getFirmsNotCont());
                                                                                        }

                if (isset($uri[2]) && $uri[2] === 'form') {//parametry formuláře

                    if (isset($uri[3]))
                        $this->output($this->firms->getFirmAndForm($uri[3]));
                    else
                        $this->output($this->firms->getFirmForm());
                } else
                    if (isset($uri[1]) && $uri[1] === 'firm' && isset($uri[2]) && $uri[2] === 'contactsList') {
                        $this->output($this->firms->contactsList());
                    } else
                        if (isset($uri[1]) && $uri[1] === 'firm') {
                            $this->output($this->firms->getFirm($uri[2]));
                        } else
                            if (isset($uri[1]) && $uri[1] === 'workshops') {
                                $this->output($this->workshops->getworkshops($uri[2]));
                            } else
                                if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'invitations') {
                                    if (isset($uri[3]))
                                        $y = intval($uri[3]);
                                    else
                                        $y = 0;
                                    $this->output($this->stats->getInvitations(1, $y));
                                } else
                                    if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'cvcount') {
                                        if (isset($uri[3]))
                                            $y = intval($uri[3]);
                                        else
                                            $y = 0;
                                        $this->output($this->stats->getCvCount($y));
                                    } else
                                        if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'practices') {
                                            if (isset($uri[3]))
                                                $y = intval($uri[3]);
                                            else
                                                $y = 0;
                                            $this->output($this->stats->getAllPractices($y));
                                        } else
                                            if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getStatBySYears') {

                                                $this->output($this->stats->getStatBySYears());
                                            } else
                                                if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllCVInvitations') {

                                                    $this->output($this->stats->getAllCVInvitations());
                                                } else
                                                    if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getFirmStats') {

                                                        $this->output($this->stats->getFirmStats());
                                                    } else
                                                        if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'export') {

                                                            $this->output($this->stats->export());
                                                        } else
                                                            if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllWSs') {
                                                                if (isset($uri[3]))
                                                                    $y = intval($uri[3]);
                                                                else
                                                                    $y = 0;
                                                                $this->output($this->stats->getAllWSs($y));
                                                            } else
                                                                if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllGifts') {
                                                                    if (isset($uri[3]))
                                                                        $y = intval($uri[3]);
                                                                    else
                                                                        $y = 0;
                                                                    $this->output($this->stats->getAllGifts($y));
                                                                } else
                                                                    if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllMeets') {
                                                                        if (isset($uri[3]))
                                                                            $y = intval($uri[3]);
                                                                        else
                                                                            $y = 0;
                                                                        $this->output($this->stats->getAllMeets($y));
                                                                    } else
                                                                        if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getTopCompanies') {
                                                                            if (isset($uri[3]))
                                                                                $y = intval($uri[3]);
                                                                            else
                                                                                $y = 0;
                                                                            $this->output($this->stats->getTopCompanies($y));
                                                                        } else
                                                                            if (isset($uri[1]) && $uri[1] === 'stats' && isset($uri[2]) && $uri[2] === 'getAllNotActivity') {
                                                                                if (isset($uri[3]))
                                                                                    $y = intval($uri[3]);
                                                                                else
                                                                                    $y = 0;
                                                                                $this->output($this->stats->getAllNotActivity($y));
                                                                            } else
                                                                                if (isset($uri[1]) && $uri[1] === 'stats') {

                                                                                    $this->output($this->stats->getAll());
                                                                                } else
                                                                                    if (isset($uri[1]) && $uri[1] === 'columnsFilter') {

                                                                                        $this->output($this->firms->getColmVisibilityFilter());
                                                                                    } else
                                                                                        if (isset($uri[1]) && $uri[1] === 'columns') {

                                                                                            $this->output($this->firms->getColmVisibility());
                                                                                        } else
                                                                                            if (isset($uri[1]) && $uri[1] === 'columnsList') {

                                                                                                $this->output($this->firms->getColms());
                                                                                            } else
                                                                                                if (isset($uri[1]) && $uri[1] === 'meets') {

                                                                                                    $this->output($this->meets->getMeets($uri[2]));
                                                                                                } else
                                                                                                    if (isset($uri[1]) && $uri[1] === 'gifts') {

                                                                                                        $this->output($this->gifts->getgifts($uri[2]));
                                                                                                    } else
                                                                                                        if (isset($uri[1]) && $uri[1] === 'practices') {
                                                                                                            if (!isset($uri[2]))
                                                                                                                $uri[2] = 0;
                                                                                                            $this->output($this->practices->getpractices($uri[2]));
                                                                                                        }
                break;
            case 'POST':
                if (isset($uri[1]) && $uri[1] === 'cvinvitations') {
                    $this->output($this->cvInvitations->save($input));
                } else
                    if (isset($uri[1]) && $uri[1] === 'campaigns') {
                        $this->output($this->campaigns->insert($input));
                    } else
                        if (isset($uri[1]) && $uri[1] === 'getCampaignSeindingExport') {
                            $this->output($this->campaigns->getCampaignSeindingExport($uri[2], $input));
                        } else
                            if (isset($uri[1]) && $uri[1] === 'campaignContacts') {
                                $this->output($this->campaigns->campaignContactsUpdate($uri[2], $input));
                            } else
                                if (isset($uri[1]) && $uri[1] === 'events') {
                                    $this->output($this->events->insert($input));
                                } else
                                    if (isset($uri[1]) && $uri[1] === 'firms') {
                                        $this->output($this->firms->insert($input));
                                    } else
                                        if (isset($uri[1]) && $uri[1] === 'contacts') {
                                            $this->output($this->contacts->insertContacts($input));
                                        } else
                                            if (isset($uri[1]) && $uri[1] === 'workshops') {
                                                $this->output($this->workshops->insert($input));
                                            } else
                                                if (isset($uri[1]) && $uri[1] === 'columns') {

                                                    $this->output($this->firms->saveColmVisibility($input));
                                                } else
                                                    if (isset($uri[1]) && $uri[1] === 'gifts') {

                                                        $this->output($this->gifts->insert($input));
                                                    } else
                                                        if (isset($uri[1]) && $uri[1] === 'column') {

                                                            $this->output($this->firms->addColm($input["name"], $input["type"]));
                                                        } else
                                                            if (isset($uri[1]) && $uri[1] === 'meets') {

                                                                $this->output($this->meets->insert($input));
                                                            } else
                                                                if (isset($uri[1]) && $uri[1] === 'practices') {
                                                                    $this->output($this->practices->save($input));
                                                                }
                break;



            case 'PUT':
                if (isset($uri[1]) && $uri[1] === 'campaigns') {
                    $this->output($this->campaigns->update($input));
                } else
                    if (isset($uri[1]) && $uri[1] === 'firms') {
                        $this->output($this->firms->updateFirm($input));
                    } else
                        if (isset($uri[1]) && $uri[1] === 'events') {
                            $this->output($this->events->update($input));
                        } else
                            if (isset($uri[1]) && $uri[1] === 'contacts') {
                                $this->output($this->contacts->updateContacts($input));
                            } else
                                if (isset($uri[1]) && $uri[1] === 'workshops') {
                                    $this->output($this->workshops->update($input));
                                } else
                                    if (isset($uri[1]) && $uri[1] === 'meets') {
                                        $this->output($this->meets->update($input));
                                    } else
                                        if (isset($uri[1]) && $uri[1] === 'gifts') {
                                            $this->output($this->gifts->update($input));
                                        } else
                                            if (isset($uri[1]) && $uri[1] === 'column') {

                                                $this->output($this->firms->updateColmn($input));
                                            }
                break;
            case 'DELETE':

                if (isset($uri[1]) && $uri[1] === 'campaignContacts') {
                    $this->output($this->campaigns->deleteCampaignContacts($uri[2], $input));
                } else
                    if (isset($uri[1]) && $uri[1] === 'campaign') {
                        $this->output($this->campaigns->delete($uri[2]));
                    } else
                        if (isset($uri[1]) && $uri[1] === 'contacts') {
                            $this->output($this->contacts->deleteContact($uri[2]));
                        } else
                            if (isset($uri[1]) && $uri[1] === 'events') {
                                $this->output($this->events->delete($uri[2]));
                            } else
                                if (isset($uri[1]) && $uri[1] === 'workshops') {
                                    $this->output($this->workshops->delete($uri[2]));
                                } else
                                    if (isset($uri[1]) && $uri[1] === 'firms') {
                                        $this->output($this->firms->delete($uri[2]));
                                    } else
                                        if (isset($uri[1]) && $uri[1] === 'meets') {
                                            $this->output($this->meets->delete($uri[2]));
                                        } else
                                            if (isset($uri[1]) && $uri[1] === 'gifts') {

                                                $this->output($this->gifts->delete($uri[2]));
                                            } else
                                                if (isset($uri[1]) && $uri[1] === 'column') {

                                                    $this->output($this->firms->deleteColmn($uri[2]));
                                                } else
                                                    if (isset($uri[1]) && $uri[1] === 'practices') {

                                                        $this->output($this->practices->delete($uri[2]));
                                                    }
                break;

            default:
                $this->output("err");

        }


    }

    private function output($str)
    {
        if (isset($_GET["csvexport"])) {
            $this->CSVoutput($str);
            exit;

        }

        if (!is_array($str)) {
            if ($str == "0")
                $str = "err";
            echo json_encode(array("msg" => $str));
        } else {
            //přidáno kvůli localhost
            /*if ($_SERVER['HTTP_HOST'][0] === 'l') {
                $str = fix_encoding($str);
            }*/
            echo json_encode($str);

        }

    }




    private function CSVoutput($str)
    {
        if ($str == null)
            return;
        $csv = "";
        // if (!is_array($str)) $str[0]["sm"] = "error";

        $fp = fopen(getcwd() . '/csvexport.csv', 'w');
        if (is_array($str)) {
            $firstRow = reset($str);
            $headers = array_merge([''], array_keys($firstRow));
            // fputcsv($fp,$this->convert_encoding($headers), ';');
            fputcsv($fp, $this->convert_encoding($headers), ';', '"', '\\');


            foreach ($str as $key => $row) {
                //echo $key;
                //print_r($row);
                if (isset($row["name"]))
                    $row["name"] = preg_replace('/\/\(kont\).*/', '', $row["name"]);
                //print_r(array_merge([$key], array_keys($row)));
                // fputcsv($fp, $this->convert_encoding(array_merge([$key], $row)), ';');
                fputcsv($fp, $this->convert_encoding(array_merge([$key], $row)), ';', '"', '\\');

                //fputcsv($fp, $this->convert_encoding($row), ';');

            }

        } else {
            $firstRow = [];
            fputs($fp, $str);
        }



        fclose($fp);
        header("Content-Type: text/plain; charset=Windows-1250");
        //header("Content-Type: text/plain; charset=UTF-8");
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="/v3/csvexport.csv"');
        readfile(getcwd() . '/csvexport.csv');
        exit;




    }
    private function convert_encoding($array)
    {
        return array_map(function ($value) {
            if ($value == null)
                return "";
            return iconv("UTF-8", "Windows-1250//IGNORE", $value);
        }, $array);
    }

    private function downloadAttachment($id)
    {
        $data = $this->campaigns->getAttachment($id);

        if (!$data || !$data["attachment"]) {
            http_response_code(404);
            echo "Soubor nenalezen";
            exit;
        }

        $filename = $data["attachment_name"];
        $filedata = $data["attachment"]; // binární data (BLOB)

        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=\"$filename\"");
        header("Content-Length: " . strlen($filedata));

        echo $filedata;
        exit;
    }

} //class


function fix_encoding($data)
{
    if (is_array($data)) {
        foreach ($data as $key => $value) {
            $data[$key] = fix_encoding($value);
        }
    } elseif (is_string($data)) {
        return iconv('ISO-8859-2', 'UTF-8//IGNORE', $data);
    }
    return $data;
}

?>
