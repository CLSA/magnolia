<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\requisition;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function get_file_as_array()
  {
    $patch_array = parent::get_file_as_array();

    // convert column "language" to language_id
    if( array_key_exists( 'language', $patch_array ) )
    {
      $language_class_name = lib::get_class_name( 'database\language' );
      $patch_array['language_id'] =
        $language_class_name::get_unique_record( 'code', $patch_array['language'] )->id;
      unset( $patch_array['language'] );
    }

    return $patch_array;
  }

  /**
   * Extend parent method
   */
  public function execute()
  {
    parent::execute();

    $headers = apache_request_headers();
    if( false !== strpos( $headers['Content-Type'], 'application/octet-stream' ) )
    {
      $filename = sprintf( '%s/%s', ETHICS_LETTER_PATH, $this->get_leaf_record()->id );
      if( false === file_put_contents( $filename, $this->get_file_as_raw() ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Unable to write file "%s"', $filename ),
          __METHOD__ );
    }

    $action = $this->get_argument( 'action', false );
    if( $action )
    {
      $db_requisition = $this->get_leaf_record();
      if( 'abandon' == $action )
      {
        // TODO: implement
      }
      else if( 'defer' == $action )
      {
        // TODO: implement
      }
      else if( 'reactivate' == $action )
      {
        // TODO: implement
      }
      else if( 'reject' == $action )
      {
        // TODO: implement
      }
      else if( 'submit' == $action )
      {
        // add the requisition to whatever the next stage is
        $db_requisition->add_to_stage();
      }
      else
      {
        log::warning( sprintf(
          'Received PATCH:requisition/%d with unknown action "%s"',
          $db_requisition->id,
          $action
        ) );
      }
    }
  }
}
