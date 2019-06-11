#!/usr/bin/php
<?php
/**
 * This is a special script used to rename agreement files based on their move from the reqn to reqn_version table
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

    $result = $this->db->query( 'SELECT reqn_id, reqn_version_id FROM reqn_current_reqn_version' );

    if( false === $result )
    {
      error( $this->db->error );
      die();
    }

    while( $row = $result->fetch_assoc() )
    {
      $old_file = sprintf( '%s/%d', AGREEMENT_LETTER_PATH, $row['reqn_id'] );
      $new_file = sprintf( '%s/%dx', AGREEMENT_LETTER_PATH, $row['reqn_version_id'] );
      if( file_exists( $old_file ) )
      {
        out( sprintf( 'Renaming "%s" to "%s"', $old_file, $new_file ) );
        rename( $old_file, $new_file );
      }
    }

    out( 'Removing "x" postfix from new filenames' );
    foreach( glob( sprintf( '%s/*x', AGREEMENT_LETTER_PATH ) ) as $filename )
      rename( $filename, substr( $filename, 0, -1 ) );

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

This utility will rename agreement filenames and should only be run ONCE after running the database patch.  If this utility is executed more than once there is a posibility of DATA LOSS so you should only run it if you are ABSOLUTELY SURE that it has never been run before.

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
