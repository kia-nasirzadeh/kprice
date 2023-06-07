<?php
class DbHandler {
    private $dbh;
    private $picsPath;
    public function __construct ()
    {
        require_once __DIR__ . DIRECTORY_SEPARATOR . './../config.php';
        $this->picsPath = $picsPath;
        $pdo_attrs = [ 
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
        ];
        $this->dbh = new PDO("mysql:host=$servername;dbname=$dbName;charset=utf8", $username, $password, $pdo_attrs);
    }
    public function getAllRecords ($how) {
        $stmt = $this->dbh->prepare("SELECT * FROM cars");
        $stmt->execute();
        $allRecords = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if ($how == '') {
            return $allRecords;
        } elseif ($how == 'forsearchpage') {
            $carsToShow = [];
            foreach ($allRecords as $car) {
                $carsToShow[$car["group"]][] = $car["subgroup"];
            }
            return $carsToShow;
        } else throw new Exception('in else in getAllRecords, $how is not correct');
    }
    public function getRecord ($by, $key) {
        if ($by == 'id') {
            $stmt = $this->dbh->prepare("SELECT * FROM cars WHERE id=$key");
            $stmt->execute();
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            return $record;
        } elseif ($by == 'fullname') {
            $stmt = $this->dbh->prepare("SELECT * FROM cars WHERE FullName=\"$key\"");
            $stmt->execute();
            $record = $stmt->fetch(PDO::FETCH_ASSOC);
            return $record;
        } else throw new Exception('in getRecord in no if-else');
    }
    public function addRecord ($group, $subgroup, $content) {
        $fullName = $group . '-' . $subgroup;
        if ($content == '') $content = "{}";
        if (!$content = $this->populatePicsOfContent(true, $content, $fullName)) return false;
        if ($this->recordExists('fullname', $fullName)) return false;
        $stmt = $this->dbh->prepare("INSERT INTO cars (`group`, `subgroup`, `content`) VALUES (:group, :subgroup, :content)");
        $stmt->bindParam(':content', $content);
        $stmt->bindParam(':subgroup', $subgroup);
        $stmt->bindParam(':group', $group);
        $result = $stmt->execute();
        return $result;
    }
    public function recordExists($by, $key) {
        $recordLikeThis = $this->getRecord($by, $key);
        if ($recordLikeThis) return true;
        else return false;
    }
    public function deleteRecord($by, $key) {
        if ($by == 'id') {
            $stmt = $this->dbh->prepare("DELETE FROM cars WHERE id=$key");
            $result = $stmt->execute();
            return $result;
        } elseif ($by == 'fullname') {
            $stmt = $this->dbh->prepare("DELETE FROM cars WHERE FullName=\"$key\"");
            $result = $stmt->execute();
            return $result;
        } else throw new Exception('in deleteRecord in no if-else');
    }
    public function updateRecord($by, $key, $group, $subgroup, $content) {
        if (!$this->recordExists($by, $key)) return false;
        if ($content == '') $content = '{}';
        $fullname = $group . '-' . $subgroup;
        if (!$content = $this->populatePicsOfContent(true, $content, $fullname)) return false;
        if ($by == 'id') {
            $stmt = $this->dbh->prepare("UPDATE cars SET `group`=:group, `subgroup`=:subgroup, `content`=:content WHERE id=:key");
            $stmt->bindParam(':group', $group);
            $stmt->bindParam(':subgroup', $subgroup);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':key', $key);
            $result = $stmt->execute();
            return $result;
        } elseif ($by == 'fullname') {
            $stmt = $this->dbh->prepare("UPDATE cars SET `group`=:group, `subgroup`=:subgroup, `content`=:content WHERE FullName=:key");
            $stmt->bindParam(':group', $group);
            $stmt->bindParam(':subgroup', $subgroup);
            $stmt->bindParam(':content', $content);
            $stmt->bindParam(':key', $key);
            $result = $stmt->execute();
            return $result;
        } else throw new Exception('in updateRecord in no if-else');
    }
    private function populatePicsOfContent ($stringified, $content, $fullname) {
        $pics = scandir($this->picsPath);
        $targetPics = [];
        foreach ($pics as $pic) {
            if (str_contains($pic, $fullname)) $targetPics[] = $pic;
        }
        if ($stringified) $content = json_decode($content, 1); // if stringified, turn it to array, otherwise it already is array
        if ($content === null) { // json_decoder can not decode $content since it's invalid json or null
            return false;
        } else { //json_decoder decoded $content, although it maybe empty
            $content['pics'] = $targetPics;
        }

        $content = json_encode($content, JSON_UNESCAPED_UNICODE);
        return $content;
    }
    public function search ($needle) {
        $stmt = $this->dbh->prepare("SELECT * FROM cars WHERE `group` LIKE :needle OR `subgroup` LIKE :needle OR `FullName` LIKE :needle");
        $needle = "%".$needle."%";
        $stmt->bindParam(':needle', $needle);
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }
}