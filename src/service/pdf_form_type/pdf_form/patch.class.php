<?php
/**
 * patch.class.php
 * 
 * @author Patrick Emond <emondpd@mcmaster.ca>
 */

namespace magnolia\service\pdf_form_type\pdf_form;
use cenozo\lib, cenozo\log, magnolia\util;

class patch extends \cenozo\service\patch
{
  /**
   * Extend parent method
   */
  public function execute()
  {
    parent::execute();

    $file = $this->get_argument( 'file', NULL );
    if( false !== strpos( util::get_header( 'Content-Type' ), 'application/pdf' ) && !is_null( $file ) )
    {
      if( 'filename' != $file ) throw lib::create( 'exception\argument', 'file', $file, __METHOD__ );

      $filename = $this->get_leaf_record()->get_filename();
      if( false === file_put_contents( $filename, $this->get_file_as_raw() ) )
        throw lib::create( 'exception\runtime',
          sprintf( 'Unable to write file "%s"', $filename ),
          __METHOD__ );
    }
  }
}
