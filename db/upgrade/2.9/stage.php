#!/usr/bin/php
<?php
/**
 * This is a special script used to populate the new amendment column in the stage table
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

    out( 'Connecting to database' );
    $this->connect_database();

    // only run this script if the stage table is missing the amendment column
    $result = $this->query(
      'SELECT COUNT(*) AS total FROM information_schema.COLUMNS '.
      'WHERE table_schema = DATABASE() '.
      'AND table_name = "stage" '.
      'AND column_name = "amendment"'
    );

    $row = $result->fetch_assoc();
    $result->free();
    if( 0 < $row['total'] )
    {
      out( 'Stage table has alredy been patched, nothing to do' );
    }
    else
    {
      out( 'Adding new amendment column to the stage table' );

      $this->query(
        'ALTER TABLE stage '.
        'ADD COLUMN amendment CHAR(1) NOT NULL DEFAULT "." '.
        'AFTER reqn_id'
      );

      // start by setting all stages to amendment "@" (meaning we don't know it yet)
      $this->query( 'UPDATE stage SET amendment = "@"' );

      // find all reqns with only one amendment: this is the initial submission or "."
      $this->query(
        'UPDATE stage '.
        'JOIN ( '.
          'SELECT reqn_id '.
          'FROM reqn_version '.
          'GROUP BY reqn_id '.
          'HAVING COUNT(DISTINCT amendment) = 1 '.
        ') AS reqn_temp USING( reqn_id ) '.
        'SET stage.amendment = "."'
      );

      out( 'Populating new column based on stage history' );

      $result = $this->query(
        'SELECT stage.*, stage_type.rank '.
        'FROM reqn '.
        'JOIN stage ON reqn.id = stage.reqn_id '.
        'JOIN stage_type ON stage.stage_type_id = stage_type.id '.
        'ORDER BY reqn.id, -stage.datetime DESC'
      );

      $reqn_id = NULL;
      $last_rank = NULL;
      $amendment = NULL;
      while( $row = $result->fetch_assoc() )
      {
        if( $reqn_id != $row['reqn_id'] )
        {
          $reqn_id = $row['reqn_id'];
          $amendment = '.';
        }
        else if( $last_rank > $row['rank'] )
        {
          $amendment = '.' == $amendment ? 'A' : chr( ord( $amendment ) + 1 );
        }

        $last_rank = $row['rank'];
        $this->query( sprintf(
          'UPDATE stage SET amendment = "%s" WHERE id = %d',
          $amendment,
          $row['id']
        ) );
      }
      $result->free();

      $this->query(
        'ALTER TABLE stage '.
        'ADD UNIQUE INDEX uq_reqn_id_amendment_stage_type_id (reqn_id ASC, amendment ASC, stage_type_id ASC)'
      );
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
