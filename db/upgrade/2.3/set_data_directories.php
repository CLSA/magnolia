#!/usr/bin/php
<?php
/**
 * This is a special script used when upgrading to version 2.3
 * This script should be run once after running patch_database.sql
 * It sets all data_directory columns in the reqn table.
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
    $this->db->set_charset( 'utf8' );
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

    out( 'Getting reqn ids which require data-directory values' );
    $result = $this->db->query(
      'SELECT id '.
      'FROM reqn '.
      'WHERE data_directory NOT REGEXP "[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}" '.
      'ORDER BY id'
    );
    if( false === $result )
    {
      error( $this->db->error );
      die();
    }

    out( 'Setting new data-directory values' );
    $total = 0;
    foreach( $result as $row )
    {
      // generate a new directory name
      $name = sprintf(
        '%s-%s-%s-%s',
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) ),
        bin2hex( openssl_random_pseudo_bytes( 2 ) )
      );

      // create the data directory
      $path = sprintf( '%s/data/%s', STUDY_DATA_PATH, $name );
      if( !file_exists( $path ) )
      {
        if( !mkdir( $path ) )
        {
          error( sprintf( 'Unable to create study-data data directory "%s"', $path ) );
          die();
        }
      }

      // create the web directory
      $path = sprintf( '%s/web/%s', STUDY_DATA_PATH, $name );
      if( !file_exists( $path ) )
      {
        if( !mkdir( $path ) )
        {
          error( sprintf( 'Unable to create study-data web directory "%s"', $path ) );
          die();
        }
      }

      $sql = sprintf( 'UPDATE reqn SET data_directory = "%s" WHERE id = %d', $name, $row['id']);
      if( false === $this->db->query( $sql ) )
      {
        error( $this->db->error );
        break;
      }

      $total++;
    }

    out( sprintf( 'Done, %d records updated', $total ) );
  }

  /**
   * Contains all initialization parameters.
   * @var array
   * @access private
   */
  private $settings = array();
}

$patch = new patch();
$patch->execute();
