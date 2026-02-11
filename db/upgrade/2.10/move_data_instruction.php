#!/usr/bin/php
<?php
/**
 * This is a special script used to move files in doc/data_instruction to the reqn_document table
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

ini_set( 'display_errors', '1' );
error_reporting( E_ALL | E_STRICT );
ini_set( 'date.timezone', 'US/Eastern' );

// utility functions
function out( $msg ) { printf( '%s: %s'."\n", date( 'Y-m-d H:i:s' ), $msg ); }
function error( $msg ) { out( sprintf( 'ERROR! %s', $msg ) ); }


class patch
{
  /**
   * Reads the framework and application settings
   * 
   * @author Patrick Emond <emondpd@mcmaster.ca>
   * @access public
   */
  public function read_settings()
  {
    // include the initialization settings
    global $SETTINGS;
    require_once '../../../settings.ini.php';
    require_once '../../../settings.local.ini.php';
    require_once $SETTINGS['path']['CENOZO'].'/src/initial.class.php';
    $initial = new \cenozo\initial();
    $this->settings = $initial->get_settings();
  }

  public function connect_database()
  {
    $server = $this->settings['db']['server'];
    $username = $this->settings['db']['username'];
    $password = $this->settings['db']['password'];
    $name = $this->settings['db']['database_prefix'] . $this->settings['general']['instance_name'];
    $this->db = new \mysqli( $server, $username, $password, $name );
    if( $this->db->connect_error )
    {
      error( $this->db->connect_error );
      die();
    }
  }

  public function query( $sql )
  {
    $result = $this->db->query( $sql );

    if( false === $result )
    {
      error( $this->db->error );
      die();
    }

    return $result;
  }

  /**
   * Executes the patch
   * 
   * @author Patrick Emond <emondpd@mcmaster.ca>
   * @access public
   */
  public function execute()
  {
    out( 'Reading configuration parameters' );
    $this->read_settings();

    // only run this script if the doc/data_instruction directory still exists
    $data_instruction_dir = sprintf( '%s/doc/data_instruction', APPLICATION_PATH );
    if( !is_dir( $data_instruction_dir ) )
    {
      out( 'Done, files already moved into reqn_document table.' );
      return;
    }

    out( 'Connecting to database' );
    $this->connect_database();
    
    foreach( glob( sprintf( '%s/[1-9]*', $data_instruction_dir ) ) as $filename )
    {
      $reqn_id = basename( $filename );
      $data = base64_encode( file_get_contents( $filename ) );
      $this->query( sprintf( 'UPDATE reqn_document SET data = "%s" WHERE reqn_id = %d', $data, $reqn_id ) );
      unlink( $filename );
    }

    out( 'Disconnecting from the database' );
    $this->db->close();

    out( 'Done' );
  }

  /**
   * Contains all initialization parameters.
   * @var array
   * @access private
   */
  private $settings = array();

  /**
   * The mysqli database connection
   * @var mysqli
   * @access private
   */
  private $db = NULL;
}

$patch = new patch();
$patch->execute();
