#!/usr/bin/php
<?php
/**
 * This is a special script used to copy ethics letters of active requisitions to the ethics_approval directory
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

    out( 'Connecting to database' );
    $this->connect_database();

    $result = $this->db->query(
      'SELECT ethics_approval.id AS ethics_approval_id, reqn_version_id '.
      'FROM ethics_approval '.
      'JOIN reqn_current_reqn_version ON ethics_approval.reqn_id = reqn_current_reqn_version.reqn_id'
    );

    if( false === $result )
    {
      error( $this->db->error );
      die();
    }

    while( $row = $result->fetch_assoc() )
    {
      $source_file = sprintf( '%s/%d', ETHICS_LETTER_PATH, $row['reqn_version_id'] );
      $destination_file = sprintf( '%s/%d', ETHICS_APPROVAL_PATH, $row['ethics_approval_id'] );
      if( file_exists( $source_file ) )
      {
        out( sprintf( 'Copying "%s" to "%s"', $source_file, $destination_file ) );
        copy( $source_file, $destination_file );
      }
    }

    out( 'Done' );
  }

  /**
   * Contains all initialization parameters.
   * @var array
   * @access private
   */
  private $settings = array();
}

print <<<WARN
*************************
***      WARNING      ***
*************************

This utility will copy ethics letters from active requisitions to the new ethics_approval directory and should only be run ONCE after running the database patch.  If this utility is executed more than once there is a posibility of DATA LOSS so you should only run it if you are ABSOLUTELY SURE that it has never been run before.

Are you sure you wish to proceed? (y/n) 
WARN;

if( 'y' == strtolower( fgetc( STDIN ) ) )
{
  $patch = new patch();
  $patch->execute();
}
else
{
  print "Aborting\n";
}
