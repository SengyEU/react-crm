<?php

class Router
{
    protected $conn;

    public function __construct($conn)
    {
        $this->conn = $conn;
    }

    public function handle($method, $uri, $input)
    {
        switch ($method) {
            case 'GET':
                $this->get($uri, $input);
                break;
            case 'POST':
                $this->post($uri, $input);
                break;
            case 'PUT':
                $this->put($uri, $input);
                break;
            case 'DELETE':
                $this->delete($uri, $input);
                break;
            default:
                $this->output("err");
        }
    }

    protected function get($uri, $input)
    {
    }

    protected function post($uri, $input)
    {
    }

    protected function put($uri, $input)
    {
    }

    protected function delete($uri, $input)
    {
    }

    protected function output($str)
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
            echo json_encode($str);
        }
    }

    protected function CSVoutput($str)
    {
        if ($str == null)
            return;
        $csv = "";

        $fp = fopen(getcwd() . '/csvexport.csv', 'w');
        if (is_array($str)) {
            $firstRow = reset($str);
            $headers = array_merge([''], array_keys($firstRow));
            fputcsv($fp, $this->convert_encoding($headers), ';', '"', '\\');

            foreach ($str as $key => $row) {
                if (isset($row["name"]))
                    $row["name"] = preg_replace('/\/\(kont\).*/', '', $row["name"]);
                fputcsv($fp, $this->convert_encoding(array_merge([$key], $row)), ';', '"', '\\');
            }
        } else {
            $firstRow = [];
            fputs($fp, $str);
        }

        fclose($fp);
        header("Content-Type: text/plain; charset=Windows-1250");
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="/v3/csvexport.csv"');
        readfile(getcwd() . '/csvexport.csv');
        exit;
    }

    protected function convert_encoding($array)
    {
        return array_map(function ($value) {
            if ($value == null)
                return "";
            return iconv("UTF-8", "Windows-1250//IGNORE", $value);
        }, $array);
    }
}